import { Button } from "@/view/components/ui/button";
import { useIdeaStore } from "@/data/stores/idea.store";

export const Pagination = () => {
	const {
		currentPage,
		hasNextPage,
		hasPrevPage,
		loading,
		nextPage,
		prevPage,
		itemsPerPage,
		totalIdeas,
		ideas,
		changeItemsPerPage,
	} = useIdeaStore();

	const handleItemsPerPageChange = (newLimit: number) => {
		changeItemsPerPage(newLimit);
	};

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
			<div className="flex items-center gap-2 text-sm text-gray-600">
				<span>Items per page:</span>
				<select
					value={itemsPerPage}
					onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
					className="px-2 py-1 border rounded text-sm"
					disabled={loading}
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
				<span className="ml-2">
					Showing {ideas.length} ideas on page {currentPage} of{" "}
					{totalIdeas / itemsPerPage === 0
						? 1
						: Math.ceil(totalIdeas / itemsPerPage)}
				</span>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={prevPage}
					disabled={!hasPrevPage || loading}
					className="min-w-[80px]"
				>
					{loading ? "..." : "Previous"}
				</Button>

				<div className="flex items-center gap-1 px-3">
					<span className="text-sm font-medium text-gray-700">
						Page {currentPage}
					</span>
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={nextPage}
					disabled={!hasNextPage || loading}
					className="min-w-[80px]"
				>
					{loading ? "..." : "Next"}
				</Button>
			</div>
		</div>
	);
};
