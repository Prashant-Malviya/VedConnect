import { useEffect, useState } from "react";
import { X, Search, Users } from "lucide-react";
import { searchCommunities, joinCommunity } from "../services/community.api";
import { Community } from "../types/community.types";

interface BrowseCommunitiesModalProps {
  onClose: () => void;
  onJoined: (community: Community) => void;
  myCommunityIds: Set<string>;
}

const BrowseCommunitiesModal = ({ onClose, onJoined, myCommunityIds }: BrowseCommunitiesModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true);
      searchCommunities(query)
        .then(setResults)
        .finally(() => setIsLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleJoin = async (community: Community) => {
    setJoiningId(community.id);
    try {
      const joined = await joinCommunity(community.id);
      onJoined(joined);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Discover communities</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-4 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search public communities..."
            className="w-full border border-purple-200 bg-lavender-50 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
          {isLoading && <p className="text-sm text-slate-400 text-center py-6">Searching...</p>}
          {!isLoading && results.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-6">No communities found</p>
          )}
          {!isLoading &&
            results.map((community) => {
              const isMember = myCommunityIds.has(community.id);
              return (
                <div
                  key={community.id}
                  className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border border-purple-100 hover:bg-purple-50/60"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{community.name}</p>
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                      <Users className="w-3 h-3" /> {community.memberCount} members
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoin(community)}
                    disabled={isMember || joiningId === community.id}
                    className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50"
                  >
                    {isMember ? "Joined" : joiningId === community.id ? "Joining..." : "Join"}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BrowseCommunitiesModal;
