import { useIdeaStore } from "@/data/stores/idea.store";
import { IdeaCard } from "./IdeaCard";
import { VoteManager } from "./VoteManager";
import { Pagination } from "./Pagination";

export const IdeaColumns = () => {
	const {
		loading,
		error,
		totalVotes,
		canVote,
		getVotedIdeas,
		getUnvotedIdeas,
		initializeStore,

		animatingIdeas,
	} = useIdeaStore();

	const votedIdeas = getVotedIdeas();
	const unvotedIdeas = getUnvotedIdeas();

	if (loading && votedIdeas.length === 0 && unvotedIdeas.length === 0) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				<span className="ml-3 text-gray-600">Loading ideas...</span>
			</div>
		);
	}

	if (error && votedIdeas.length === 0 && unvotedIdeas.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-red-600 mb-4">
					<svg
						className="mx-auto h-12 w-12"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-label="Error"
					>
						<title>Error icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					Failed to load ideas
				</h3>
				<p className="text-gray-600 mb-4">{error}</p>
				<button
					type="button"
					onClick={() => initializeStore()}
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Vote Manager Component */}
			<VoteManager />

			{/* Vote Status Header */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-semibold text-blue-900">
							Your Voting Status
						</h2>
						<p className="text-blue-700">
							You have used {totalVotes} out of 10 votes
						</p>
					</div>
					<div className="flex items-center">
						<div className="w-32 bg-blue-200 rounded-full h-2">
							<div
								className={`h-2 rounded-full transition-all duration-300 ${
									totalVotes >= 10 ? "bg-red-500" : "bg-blue-600"
								}`}
								style={{ width: `${(totalVotes / 10) * 100}%` }}
							/>
						</div>
						<span
							className={`ml-3 text-sm font-medium ${
								canVote() ? "text-blue-600" : "text-red-600"
							}`}
						>
							{canVote() ? `${10 - totalVotes} left` : "Limit reached"}
						</span>
					</div>
				</div>
			</div>

			{/* Two-Column Layout */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
				{/* My Votes Column */}
				<div className="space-y-4 order-1">
					<div className="sticky top-4 z-10 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
						<h2 className="text-xl font-bold text-green-800 flex items-center">
							<svg
								className="w-6 h-6 mr-2"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<title>Voted ideas checkmark</title>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
							My Votes ({votedIdeas.length})
						</h2>
						<p className="text-green-700 text-sm mt-1">
							Ideas you have voted for
						</p>
						{votedIdeas.length > 0 && (
							<div className="mt-2 flex items-center text-xs text-green-600">
								<div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
								{votedIdeas.length === 1
									? "Your voice matters!"
									: `${votedIdeas.length} great choices!`}
							</div>
						)}
					</div>

					<div className="space-y-4 min-h-[200px]">
						{votedIdeas.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								<svg
									className="mx-auto h-8 w-8 mb-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>No votes yet</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586l-4 4z"
									/>
								</svg>
								<p>No votes yet</p>
								<p className="text-xs">Vote for ideas to see them here!</p>
							</div>
						) : (
							votedIdeas.map((idea) => (
								<div
									key={idea.id}
									className={`transition-all duration-500 ${
										animatingIdeas.has(idea.id)
											? "animate-pulse scale-105 shadow-lg"
											: ""
									}`}
								>
									<IdeaCard idea={idea} />
								</div>
							))
						)}
					</div>
				</div>

				{/* All Ideas Column */}
				<div className="space-y-4 order-2">
					<div className="sticky top-4 z-10 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
						<h2 className="text-xl font-bold text-blue-800 flex items-center">
							<svg
								className="w-6 h-6 mr-2"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<title>All ideas circle</title>
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							All Ideas ({unvotedIdeas.length})
						</h2>
						<p className="text-blue-700 text-sm mt-1">
							Available ideas to vote for
							{canVote() && (
								<span className="ml-1 font-medium">
									• {10 - totalVotes} votes left
								</span>
							)}
						</p>
						{loading && (
							<div className="flex items-center mt-2 text-blue-600">
								<div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent mr-2"></div>
								<span className="text-xs">Loading more ideas...</span>
							</div>
						)}
					</div>

					<div className="space-y-4 min-h-[200px]">
						{unvotedIdeas.length === 0 && !loading ? (
							<div className="text-center py-12 text-gray-500 bg-blue-50/50 rounded-xl border-2 border-dashed border-blue-200">
								<div className="animate-bounce delay-75">
									<svg
										className="mx-auto h-12 w-12 mb-4 text-blue-300"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<title>All voted</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<p className="font-medium text-gray-600 mb-2">
									All done here! 🎉
								</p>
								<p className="text-sm text-gray-500">
									You've voted for all ideas on this page.
									<br />
									Load more ideas or check the next page for more!
								</p>
							</div>
						) : (
							unvotedIdeas.map((idea) => (
								<div
									key={idea.id}
									className={`transition-all duration-700 ease-out ${
										animatingIdeas.has(idea.id)
											? "opacity-30 scale-95 transform translate-x-6 blur-[1px]"
											: "opacity-100 scale-100 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg"
									}`}
								>
									<IdeaCard idea={idea} />
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Pagination */}
			{(votedIdeas.length > 0 || unvotedIdeas.length > 0) && <Pagination />}
		</div>
	);
};
