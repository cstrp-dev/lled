import { Button } from "@/view/components/ui/button";
import { useIdeaStore } from "@/data/stores/idea.store";

export const VoteManager = () => {
	const { totalVotes, votedIdeas, resetVoteState, canVote, ideas } =
		useIdeaStore();

	const votedIdeaTitles = ideas
		.filter((idea) => votedIdeas.has(idea.id))
		.map(
			(idea) =>
				idea.title.substring(0, 30) + (idea.title.length > 30 ? "..." : ""),
		)
		.slice(0, 3);

	return (
		<div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
				<div className="space-y-2">
					<h2 className="font-semibold text-gray-900">Ideas Vote Manager</h2>
					<div className="text-sm text-gray-600 space-y-1">
						<p>
							Total votes used:{" "}
							<span className="font-medium">{totalVotes}/10</span>
						</p>
						<p
							className={`font-medium ${canVote() ? "text-green-600" : "text-red-600"}`}
						>
							Status: {canVote() ? "Can vote" : "Limit reached"}
						</p>
						{votedIdeaTitles.length > 0 && (
							<div className="mt-2">
								<p className="text-xs text-gray-500 mb-1">
									Recently voted ideas:
								</p>
								<div className="text-xs text-gray-700 space-y-1">
									{votedIdeaTitles.map((title) => (
										<div key={title} className="truncate">
											• {title}
										</div>
									))}
									{votedIdeas.size > 3 && (
										<div className="text-gray-500">
											... and {votedIdeas.size - 3} more
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="space-y-2 sm:space-y-0 sm:space-x-2 sm:flex">
					<Button
						onClick={resetVoteState}
						variant="outline"
						size="sm"
						className="text-xs"
					>
						Reset Vote State
					</Button>
				</div>
			</div>
		</div>
	);
};
