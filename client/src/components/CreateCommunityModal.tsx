import { useState, FormEvent } from "react";
import { X } from "lucide-react";
import { createCommunity } from "../services/community.api";
import { Community } from "../types/community.types";

interface CreateCommunityModalProps {
  onClose: () => void;
  onCreated: (community: Community) => void;
}

const CreateCommunityModal = ({ onClose, onCreated }: CreateCommunityModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const community = await createCommunity({ name: name.trim(), description: description.trim(), isPrivate });
      onCreated(community);
      onClose();
    } catch (err) {
      setError("Failed to create community. Please try a different name.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Create a community</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frontend Guild"
              className="w-full border border-purple-200 bg-lavender-50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              maxLength={80}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this community about?"
              rows={3}
              className="w-full border border-purple-200 bg-lavender-50 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              maxLength={500}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded border-purple-300 text-purple-600 focus:ring-purple-400"
            />
            Private (invite-only, hidden from search)
          </label>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl py-2.5 font-medium text-sm shadow-soft hover:shadow-card disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Creating..." : "Create community"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
