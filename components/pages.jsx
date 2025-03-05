import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({ currentPage, totalPages, sort = 'def' }) => {
  // Create an array for page numbers to render
  const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5; // Maximum number of pages to show
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
          endPage = totalPages;
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
      }
      return pages;
  };

  return (
      <Pagination className="mt-4">
          <PaginationContent>
              {/* Previous Button - Only Show if NOT on First Page */}
              {currentPage > 1 && (
                  <PaginationItem>
                      <PaginationPrevious
                          href={`?page=${currentPage - 1}&sort=${sort}`}
                      />
                  </PaginationItem>
              )}

              {/* Page Numbers */}
              {getPageNumbers().map((page) => (
                  <PaginationItem key={page}>
                      <PaginationLink
                          href={`?page=${page}&sort=${sort}`}
                          isActive={page === currentPage}
                      >
                          {page}
                      </PaginationLink>
                  </PaginationItem>
              ))}

              {/* Next Button - Only Show if NOT on Last Page */}
              {currentPage < totalPages && (
                  <PaginationItem>
                      <PaginationNext
                          href={`?page=${currentPage + 1}&sort=${sort}`}
                      />
                  </PaginationItem>
              )}
          </PaginationContent>
      </Pagination>
  );
};

export default PaginationComponent;