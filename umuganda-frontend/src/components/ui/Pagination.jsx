import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [5, 10, 20, 50],
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1 && totalItems <= itemsPerPageOptions[0]) return null;

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Build page number buttons with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const btnBase = "h-9 w-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all";
    const btnActive = `${btnBase} bg-rwanda-blue text-white shadow-md shadow-blue-500/20`;
    const btnDefault = `${btnBase} bg-gray-50 text-gray-600 hover:bg-gray-100`;
    const btnDisabled = `${btnBase} bg-gray-50 text-gray-300 cursor-not-allowed`;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
            {/* Left — summary + rows per page */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>
                    Showing <span className="font-bold text-gray-700">{startItem}–{endItem}</span> of{' '}
                    <span className="font-bold text-gray-700">{totalItems}</span> records
                </span>
                {onItemsPerPageChange && (
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            onItemsPerPageChange(Number(e.target.value));
                            onPageChange(1);
                        }}
                        className="bg-gray-50 border-none rounded-lg px-2 py-1 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-rwanda-blue/20 outline-none cursor-pointer"
                    >
                        {itemsPerPageOptions.map(opt => (
                            <option key={opt} value={opt}>{opt} / page</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Right — navigation */}
            <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? btnDisabled : btnDefault}
                    title="First page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Prev */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? btnDisabled : btnDefault}
                    title="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="h-9 w-9 flex items-center justify-center text-gray-400 text-sm">
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={page === currentPage ? btnActive : btnDefault}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? btnDisabled : btnDefault}
                    title="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? btnDisabled : btnDefault}
                    title="Last page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
