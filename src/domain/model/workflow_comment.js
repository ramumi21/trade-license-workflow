/**
 * XJ3395 — Domain Layer
 * What this file handles: Entity for workflow comments.
 */
class WorkflowComment {
  constructor(id, authorId, role, message, createdAt) {
    this.id = id;
    this.authorId = authorId;
    this.role = role;
    this.message = message;
    this.createdAt = createdAt || new Date();
  }
}
module.exports = { WorkflowComment };
