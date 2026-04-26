/**
 * XJ3395 — Domain Layer
 * What this file handles: Aggregate root for Trade License Application.
 */
const { WorkflowStatus } = require('../enums/workflow_status');
const { ReviewAction } = require('../enums/review_action');
const { ApprovalAction } = require('../enums/approval_action');
const { InvalidWorkflowTransitionException } = require('../exceptions/invalid_workflow_transition_exception');
const { PaymentNotSettledException } = require('../exceptions/payment_not_settled_exception');
const { ApplicationSubmittedEvent } = require('../events/application_submitted_event');
const { ApplicationReviewedEvent } = require('../events/application_reviewed_event');
const { ApplicationApprovedEvent } = require('../events/application_approved_event');
const { WorkflowComment } = require('./workflow_comment');

class TradeLicenseApplication {
  constructor({
    id, applicationNumber, licenseType, status, applicantId,
    commodityId, payment, attachments = [], comments = [], createdAt, updatedAt
  }) {
    this.id = id;
    this.applicationNumber = applicationNumber;
    this.licenseType = licenseType;
    this.status = status || WorkflowStatus.PENDING;
    this.applicantId = applicantId;
    this.commodityId = commodityId;
    this.payment = payment;
    this.attachments = attachments;
    this.comments = comments;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    
    this.domainEvents = [];
  }

  submit() {
    if (this.status !== WorkflowStatus.PENDING && this.status !== WorkflowStatus.ADJUSTED) {
      throw new InvalidWorkflowTransitionException(`Cannot submit from status ${this.status}`);
    }
    if (!this.payment || !this.payment.isSettled) {
      throw new PaymentNotSettledException('Payment must be settled before submission');
    }
    if (this.attachments.length < 1) {
      throw new Error('At least one attachment required');
    }
    
    this.status = WorkflowStatus.SUBMITTED;
    this.updatedAt = new Date();
    this.registerEvent(new ApplicationSubmittedEvent(this.id));
  }

  review(action, commentMessage, reviewerId) {
    if (![WorkflowStatus.SUBMITTED, WorkflowStatus.ADJUSTED, WorkflowStatus.RE_REVIEW].includes(this.status)) {
      throw new InvalidWorkflowTransitionException(`Cannot review from status ${this.status}`);
    }

    if (action === ReviewAction.ACCEPT) {
      this.status = WorkflowStatus.UNDER_REVIEW;
    } else if (action === ReviewAction.REJECT) {
      this.status = WorkflowStatus.REJECTED;
    } else if (action === ReviewAction.ADJUST) {
      this.status = WorkflowStatus.ADJUSTED;
    } else {
      throw new Error(`Invalid review action ${action}`);
    }

    if (commentMessage) {
      this.comments.push(new WorkflowComment(null, reviewerId, 'REVIEWER', commentMessage));
    }

    this.updatedAt = new Date();
    this.registerEvent(new ApplicationReviewedEvent(this.id, action));
  }

  approve(action, commentMessage, approverId) {
    if (this.status !== WorkflowStatus.UNDER_REVIEW) {
      throw new InvalidWorkflowTransitionException(`Cannot approve from status ${this.status}`);
    }

    if (action === ApprovalAction.APPROVE) {
      this.status = WorkflowStatus.APPROVED;
    } else if (action === ApprovalAction.REJECT) {
      this.status = WorkflowStatus.REJECTED;
    } else if (action === ApprovalAction.REREVIEW) {
      this.status = WorkflowStatus.PENDING;
    } else {
      throw new Error(`Invalid approval action ${action}`);
    }

    if (commentMessage) {
      this.comments.push(new WorkflowComment(null, approverId, 'APPROVER', commentMessage));
    }

    this.updatedAt = new Date();
    this.registerEvent(new ApplicationApprovedEvent(this.id, action));
  }

  cancel() {
    if (this.status !== WorkflowStatus.PENDING && this.status !== WorkflowStatus.ADJUSTED) {
      throw new InvalidWorkflowTransitionException(`Cannot cancel from status ${this.status}`);
    }
    this.status = WorkflowStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  registerEvent(event) {
    this.domainEvents.push(event);
  }

  getDomainEvents() {
    return [...this.domainEvents];
  }

  clearEvents() {
    this.domainEvents = [];
  }
}

module.exports = { TradeLicenseApplication };
