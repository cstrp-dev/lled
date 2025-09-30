import { useEffect } from "react";
import { useIdeaStore } from "@/data/stores/idea.store";
import { IdeaCard } from "./IdeaCard";
import { VoteManager } from "./VoteManager";
import { Pagination } from "./Pagination";

export const IdeaList = () => {
	const {
		ideas,
		loading,
		error,
		totalVotes,
		canVote,
		initializeStore,
		fetchIdeas,
	} = useIdeaStore();

	useEffect(() => {
		initializeStore();
	}, [initializeStore]);

	if (loading && ideas.length === 0) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				<span className="ml-3 text-gray-600">Loading ideas...</span>
			</div>
		);
	}

	if (error && ideas.length === 0) {
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
					onClick={() => fetchIdeas()}
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
								className={`h-2 rounded-full transition-all ${
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

			{/* Ideas Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-900">
					Ideas ({ideas.length} on this page)
				</h1>
				{loading && ideas.length > 0 && (
					<div className="flex items-center text-gray-600">
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
						Loading...
					</div>
				)}
			</div>

			{/* Ideas List */}
			{ideas.length === 0 && !loading ? (
				<div className="text-center py-12">
					<div className="text-gray-400 mb-4">
						<svg
							className="mx-auto h-12 w-12"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-label="No ideas"
						>
							<title>Light bulb icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No ideas yet
					</h3>
					<p className="text-gray-600">Be the first to share an idea!</p>
				</div>
			) : (
				<div className="space-y-4">
					{ideas.map((idea) => (
						<IdeaCard key={idea.id} idea={idea} />
					))}
				</div>
			)}

			{/* Pagination */}
			{ideas.length > 0 && <Pagination />}
		</div>
	);
};
