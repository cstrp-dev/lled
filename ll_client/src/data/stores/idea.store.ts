import { toast } from "sonner";
import { api } from "../constants";
import type { Idea } from "../types";
import { create } from "zustand";

interface IdeaStore {
    ideas: Idea[];
    error: string | null;
    loading: boolean;
    votedIdeas: Set<string>;
    votedIdeasDetails: Idea[];
    totalVotes: number;
    currentPage: number;
    totalIdeas: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    animatingIdeas: Set<string>;

    getVotedIdeas: () => Idea[];
    getUnvotedIdeas: () => Idea[];

    fetchIdeas: (page?: number, limit?: number) => Promise<void>;
    voteIdea: (ideaId: string) => Promise<void>;
    hasVotedForIdea: (ideaId: string) => boolean;
    canVote: () => boolean;
    resetVoteState: () => Promise<void>;

    goToPage: (page: number) => Promise<void>;
    nextPage: () => Promise<void>;
    prevPage: () => Promise<void>;
    changeItemsPerPage: (newLimit: number) => Promise<void>;

    fetchVoteStatus: () => Promise<void>;
    fetchVotedIdeasDetails: () => Promise<void>;
    initializeStore: () => Promise<void>;

    startAnimation: (ideaId: string) => void;
    endAnimation: (ideaId: string) => void;
}

export const useIdeaStore = create<IdeaStore>((set, get) => ({
    ideas: [],
    error: null,
    loading: false,
    votedIdeas: new Set(),
    votedIdeasDetails: [],
    totalVotes: 0,
    currentPage: 1,
    totalIdeas: 0,
    itemsPerPage: 5,
    hasNextPage: false,
    hasPrevPage: false,
    animatingIdeas: new Set(),

    getVotedIdeas: () => {
        const state = get();
        return state.votedIdeasDetails;
    },

    getUnvotedIdeas: () => {
        const state = get();
        return state.ideas.filter(idea => !state.votedIdeas.has(idea.id));
    },

    startAnimation: (ideaId: string) => {
        const state = get();
        const newAnimatingIdeas = new Set(state.animatingIdeas);
        newAnimatingIdeas.add(ideaId);
        set({ animatingIdeas: newAnimatingIdeas });
    },

    endAnimation: (ideaId: string) => {
        const state = get();
        const newAnimatingIdeas = new Set(state.animatingIdeas);
        newAnimatingIdeas.delete(ideaId);
        set({ animatingIdeas: newAnimatingIdeas });
    },

    fetchVoteStatus: async () => {
        try {
            const response = await api.get('/votes/status');
            const { totalVotes, votedIdeaIds } = response.data;

            set({
                totalVotes,
                votedIdeas: new Set(votedIdeaIds || [])
            });

            if (votedIdeaIds && votedIdeaIds.length > 0) {
                await get().fetchVotedIdeasDetails();
            }
        } catch (error) {
            console.error('Failed to fetch vote status:', error);
        }
    },

    fetchVotedIdeasDetails: async () => {
        try {
            const state = get();
            const votedIds = Array.from(state.votedIdeas);

            if (votedIds.length === 0) {
                set({ votedIdeasDetails: [] });
                return;
            }

            const promises = votedIds.map(id => api.get(`/ideas/${id}`));
            const responses = await Promise.allSettled(promises);

            const votedIdeasDetails: Idea[] = [];
            responses.forEach((response, index) => {
                if (response.status === 'fulfilled' && response.value.data) {
                    votedIdeasDetails.push(response.value.data);
                } else {
                    console.warn(`Failed to fetch details for idea ${votedIds[index]}`);
                }
            });

            set({ votedIdeasDetails });
        } catch (error) {
            console.error('Failed to fetch voted ideas details:', error);
        }
    },

    initializeStore: async () => {
        await get().fetchVoteStatus();
        await get().fetchIdeas();
    },

    fetchIdeas: async (page: number = 1, limit: number = 5) => {
        try {
            set({ loading: true, error: null });

            const offset = (page - 1) * limit;
            const response = await api.get('/ideas', { params: { limit, offset } });

            const ideas = response.data.ideas
            const totalIdeas = response.data.total;

            set({
                ideas,
                currentPage: page,
                itemsPerPage: limit,
                totalIdeas,
                hasNextPage: ideas.length === limit,
                hasPrevPage: page > 1,
                loading: false
            });
        } catch (error) {
            console.error('Failed to fetch ideas:', error);
            set({
                error: 'Failed to fetch ideas',
                loading: false
            });
            toast.error('Failed to load ideas');
        }
    },

    goToPage: async (page: number) => {
        const state = get();
        if (page !== state.currentPage) {
            await state.fetchIdeas(page, state.itemsPerPage);
        }
    },

    nextPage: async () => {
        const state = get();
        if (state.hasNextPage) {
            await state.goToPage(state.currentPage + 1);
        }
    },

    prevPage: async () => {
        const state = get();
        if (state.hasPrevPage) {
            await state.goToPage(state.currentPage - 1);
        }
    },

    changeItemsPerPage: async (newLimit: number) => {
        const state = get();

        set({ itemsPerPage: newLimit });

        await state.fetchIdeas(1, newLimit);
    },

    voteIdea: async (ideaId: string) => {
        const state = get();

        if (!state.canVote()) {
            toast.error('You have reached the maximum number of votes (10)');
            return;
        }

        if (state.hasVotedForIdea(ideaId)) {
            toast.error('You have already voted for this idea');
            return;
        }

        try {
            get().startAnimation(ideaId);

            set({ loading: true, error: null });

            await api.post(`/ideas/${ideaId}/vote`);

            await new Promise(resolve => setTimeout(resolve, 300));

            const newVotedIdeas = new Set(state.votedIdeas);
            newVotedIdeas.add(ideaId);

            const updatedIdeas = state.ideas.map(idea =>
                idea.id === ideaId
                    ? { ...idea, votes: typeof idea.votes === 'number' ? idea.votes + 1 : idea.votes.length + 1 }
                    : idea
            ).sort((a, b) => Number(b.votes) - Number(a.votes));

            const votedIdea = updatedIdeas.find(idea => idea.id === ideaId);
            const newVotedIdeasDetails = votedIdea && !state.votedIdeasDetails.some(idea => idea.id === ideaId)
                ? [...state.votedIdeasDetails, votedIdea]
                : state.votedIdeasDetails.map(idea =>
                    idea.id === ideaId ? { ...idea, votes: typeof idea.votes === 'number' ? idea.votes + 1 : idea.votes.length + 1 } : idea
                  );

            set({
                votedIdeas: newVotedIdeas,
                votedIdeasDetails: newVotedIdeasDetails,
                totalVotes: state.totalVotes + 1,
                ideas: updatedIdeas,
                loading: false
            });

            setTimeout(() => {
                get().endAnimation(ideaId);
            }, 500);

            get().fetchVoteStatus();
            toast.success('Vote recorded successfully!');

        } catch (error) {
            console.error('Failed to vote for idea:', error);

            let errorMessage = 'Failed to vote for idea';

            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number; data?: { message?: string } } };

                if (axiosError.response?.status === 409) {
                    const message = axiosError.response.data?.message || 'Conflict occurred';

                    if (message.includes('limit exceeded')) {
                        errorMessage = 'You have reached the maximum number of votes';

                        set({ totalVotes: 10 });

                    } else if (message.includes('Already voted')) {
                        errorMessage = 'You have already voted for this idea';

                        const newVotedIdeas = new Set(state.votedIdeas);

                        newVotedIdeas.add(ideaId);

                        set({ votedIdeas: newVotedIdeas });
                    }
                } else if (axiosError.response?.status === 404) {
                    errorMessage = 'Idea not found';
                }
            }

            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
        }
    },

    hasVotedForIdea: (ideaId: string) => {
        return get().votedIdeas.has(ideaId);
    },

    canVote: () => {
        return get().totalVotes < 10;
    },

    resetVoteState: async () => {
       try {
         await api.delete('/votes/reset')

        set({
            votedIdeas: new Set(),
            votedIdeasDetails: [],
            totalVotes: 0,
            error: null
        });

        toast.success('Vote state reset');
       } catch (error) {
        console.error('Failed to reset votes on server:', error);

        toast.error('Failed to reset votes on server');
       }
    }
}))

useIdeaStore.getState().initializeStore();
