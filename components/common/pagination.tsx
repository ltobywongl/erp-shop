"use client";
import { SetStateAction } from "react";

function PaginationClient({
  setPagination,
  pagination,
  totalPages,
}: Readonly<{
  setPagination: (value: SetStateAction<Pagination>) => void;
  pagination: Pagination;
  totalPages: number;
}>) {
  if (totalPages === 0) {
    return null;
  }
  return (
    <div className="mt-2">
      <div className="w-full flex justify-between gap-4">
        <button
          className="hover:bg-slate-50 w-full border rounded px-2 py-1"
          onClick={() =>
            setPagination((p) => {
              return { ...p, pageIndex: 0 };
            })
          }
          disabled={pagination.pageIndex <= 0}
        >
          {"<<"}
        </button>
        <button
          className="hover:bg-slate-50 w-full border rounded px-2 py-1"
          onClick={() =>
            setPagination((p) => {
              return { ...p, pageIndex: p.pageIndex - 1 };
            })
          }
          disabled={pagination.pageIndex <= 0}
        >
          {"<"}
        </button>
        <button
          className="hover:bg-slate-50 w-full border rounded px-2 py-1"
          onClick={() =>
            setPagination((p) => {
              return { ...p, pageIndex: p.pageIndex + 1 };
            })
          }
          disabled={pagination.pageIndex >= totalPages - 1}
        >
          {">"}
        </button>
        <button
          className="hover:bg-slate-50 w-full border rounded px-2 py-1"
          onClick={() =>
            setPagination((p) => {
              return { ...p, pageIndex: totalPages - 1 };
            })
          }
          disabled={pagination.pageIndex >= totalPages - 1}
        >
          {">>"}
        </button>
      </div>
      <div className="w-full flex justify-center my-1 text-base">
        <strong>
          {pagination.pageIndex + 1}/{totalPages}
        </strong>
      </div>
    </div>
  );
}

export default PaginationClient;
