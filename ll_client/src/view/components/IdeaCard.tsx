import { Button } from "@/view/components/ui/button";
import { useIdeaStore } from "@/data/stores/idea.store";
import type { Idea } from "@/data/types";

interface IdeaCardProps {
	idea: Idea;
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
	const { voteIdea, hasVotedForIdea, canVote, loading, animatingIdeas } =
		useIdeaStore();

	const handleVote = async () => {
		await voteIdea(idea.id);
	};

	const hasVoted = hasVotedForIdea(idea.id);
	const canUserVote = canVote();
	const isVoteDisabled = hasVoted || !canUserVote || loading;
	const isAnimating = animatingIdeas.has(idea.id);

	const getButtonText = () => {
		if (isAnimating) return "Voting...";
		if (hasVoted) return "Voted";
		if (!canUserVote && !hasVoted) return "Limit Reached";
		return "Vote";
	};

	const getButtonVariant = () => {
		if (isAnimating) return "outline" as const;
		if (hasVoted) return "secondary" as const;
		if (!canUserVote && !hasVoted) return "destructive" as const;
		return "default" as const;
	};

	return (
		<div
			className={`
			border rounded-lg p-6 bg-white shadow-sm hover:shadow-md
			transition-all duration-300 ease-in-out
			${hasVoted ? "border-green-200 bg-green-50" : "border-gray-200"}
			${isAnimating ? "animate-pulse scale-105 shadow-lg border-blue-300" : ""}
		`}
		>
			<div className="flex justify-between items-start gap-4">
				<div className="flex-1">
					<div className="flex items-start gap-2">
						<h3 className="text-lg font-semibold mb-2 text-gray-900 flex-1">
							{idea.title}
						</h3>
						{hasVoted && (
							<div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
								<svg
									className="w-4 h-4 text-green-600"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<title>Voted checkmark</title>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						)}
					</div>
					{idea.description && (
						<p className="text-gray-600 mb-4 line-clamp-3">
							{idea.description}
						</p>
					)}
					<div className="flex items-center gap-4 text-sm text-gray-500">
						<span
							className={`font-medium flex items-center gap-1 ${hasVoted ? "text-green-600" : ""}`}
						>
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<title>Vote count</title>
								<path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
							</svg>
							{Number(idea.votes)} {idea.votes === 1 ? "vote" : "votes"}
						</span>
						<span>Created {new Date(idea.createdAt).toLocaleDateString()}</span>
					</div>
				</div>

				<div className="flex flex-col items-end gap-2">
					<Button
						onClick={handleVote}
						disabled={isVoteDisabled}
						variant={getButtonVariant()}
						size="sm"
						className={`min-w-[100px] transition-all duration-200 ${
							isAnimating ? "animate-bounce" : ""
						}`}
					>
						{getButtonText()}
					</Button>
					{hasVoted && (
						<span className="text-xs text-green-600 font-medium animate-in fade-in duration-300">
							✓ You voted
						</span>
					)}
				</div>
			</div>
		</div>
	);
};
