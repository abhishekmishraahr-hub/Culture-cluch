import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST reviewer approval or rejection actions
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      productId, 
      department, // 'Verification', 'Product', 'Content', 'Quality', 'Pricing', 'Photography', 'SEO', 'Admin'
      reviewerId, 
      status, // 'Approved', 'Rejected'
      comments 
    } = body;

    if (!productId || !department || !status) {
      return NextResponse.json({ error: "Missing required parameters (productId, department, status)" }, { status: 400 });
    }

    // Find the active workflow details
    const workflow = await prisma.approvalWorkflow.findUnique({
      where: { productId },
      include: { product: true }
    });

    if (!workflow) {
      return NextResponse.json({ error: "No active approval workflow found for this product" }, { status: 404 });
    }

    // Record review comment
    const comment = await prisma.workflowComment.create({
      data: {
        workflowId: workflow.id,
        department,
        reviewerId,
        status,
        comments: comments || `${department} review completed with status: ${status}`
      }
    });

    let nextStage = workflow.currentStage;
    let productStatus = workflow.product.isActive ? "Published" : "Submitted";

    if (status === "Rejected") {
      nextStage = "REJECTED";
      productStatus = "Rejected";

      // Update product record
      await prisma.product.update({
        where: { id: productId },
        data: { isActive: false }
      });

      // Log status transition
      await prisma.productStatusHistory.create({
        data: {
          productId,
          fromStatus: workflow.currentStage,
          toStatus: "Rejected",
          changedBy: reviewerId,
          remarks: `Rejected by ${department}. Reason: ${comments}`
        }
      });

      // Update workflow stage
      await prisma.approvalWorkflow.update({
        where: { productId },
        data: { currentStage: "REJECTED" }
      });
      
    } else {
      // Logic for moving to next sequential review stage
      const stagesSequence = [
        "VERIFICATION_REVIEW",
        "PRODUCT_REVIEW",
        "CONTENT_REVIEW",
        "QUALITY_REVIEW",
        "PRICING_REVIEW",
        "PHOTOGRAPHY_REVIEW",
        "SEO_REVIEW",
        "ADMIN_FINAL_REVIEW"
      ];

      const currentIndex = stagesSequence.indexOf(workflow.currentStage);
      if (currentIndex !== -1 && currentIndex < stagesSequence.length - 1) {
        nextStage = stagesSequence[currentIndex + 1];
        
        await prisma.approvalWorkflow.update({
          where: { productId },
          data: { currentStage: nextStage }
        });

        await prisma.productStatusHistory.create({
          data: {
            productId,
            fromStatus: workflow.currentStage,
            toStatus: nextStage,
            changedBy: reviewerId,
            remarks: `Approved by ${department}. Proceeding to ${nextStage}`
          }
        });
      } else if (workflow.currentStage === "ADMIN_FINAL_REVIEW") {
        // Final approval -> Publish product
        nextStage = "PUBLISHED";
        
        await prisma.product.update({
          where: { id: productId },
          data: { isActive: true } // Make live on public website
        });

        await prisma.productStatusHistory.create({
          data: {
            productId,
            fromStatus: "ADMIN_FINAL_REVIEW",
            toStatus: "Published",
            changedBy: reviewerId,
            remarks: "Admin final approval granted. Product published live."
          }
        });

        // Clean up workflow queue
        await prisma.approvalWorkflow.delete({
          where: { productId }
        });
      }
    }

    return NextResponse.json({ 
      message: `Review processed successfully for department ${department}`,
      nextStage,
      statusHistoryRecord: comment
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
