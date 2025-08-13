"use client";

import { useState } from "react";

export default function CommentSection() {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("댓글 기능은 아직 구현되지 않았습니다.");
    setComment("");
  };

  return (
    <div className="p-4 mt-4 bg-white border rounded-2xl text-sm text-gray-600">
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring"
          rows={3}
        />
        <button
          type="submit"
          className="px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          등록
        </button>
      </form>
    </div>
  );
}
