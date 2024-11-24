import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schema definition for the documents table in the database
 * Định nghĩa schema cho bảng documents trong cơ sở dữ liệu
 * 
 * @property {string} title - The title of the document / Tiêu đề của tài liệu
 * @property {string} userId - The ID of the user who owns the document / ID của người dùng sở hữu tài liệu
 * @property {boolean} isArchived - Whether the document is archived / Tài liệu đã được lưu trữ hay chưa
 * @property {string} [parentDocument] - The ID of the parent document (optional) / ID của tài liệu cha (tùy chọn)
 * @property {string} [content] - The content of the document (optional) / Nội dung của tài liệu (tùy chọn)
 * @property {string} [coverImage] - The URL of the cover image (optional) / URL của ảnh bìa (tùy chọn)
 * @property {string} [icon] - The icon of the document (optional) / Biểu tượng của tài liệu (tùy chọn)
 * @property {boolean} isPublished - Whether the document is published / Tài liệu đã được công bố hay chưa
 * 
 * @index by_user - Index on userId for quick user-based queries
 *                  Chỉ mục trên userId để truy vấn nhanh theo người dùng
 * @index by_user_parent - Compound index on userId and parentDocument for hierarchical queries
 *                        Chỉ mục kép trên userId và parentDocument cho truy vấn phân cấp
 */
export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
  .index("by_user", ["userId"])
  .index("by_user_parent", ["userId", "parentDocument"])
});
