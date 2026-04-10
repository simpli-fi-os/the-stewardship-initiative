'use client'

import { useState, useEffect } from 'react'
import { Listing } from '@/lib/types/directory'

interface ListingsManagerProps {
  initialListings: Listing[]
}

type FilterStatus = 'all' | 'pending' | 'published' | 'rejected'

export default function ListingsManager({ initialListings }: ListingsManagerProps) {
  const [listings, setListings] = useState(initialListings)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Listing>>({})
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const filteredListings = listings.filter((listing) => {
    const matchesStatus =
      filterStatus === 'all' || (!listing.published && filterStatus === 'pending') || (listing.published && filterStatus === 'published')
    const matchesSearch =
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleEdit = (listing: Listing) => {
    setEditingId(listing.id)
    setEditData(listing)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
    setMessage(null)
  }

  const handleSave = async (id: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) {
        throw new Error('Failed to update listing')
      }

      const { listing: updatedListing } = await response.json()
      setListings((prev) =>
        prev.map((l) => (l.id === id ? updatedListing : l))
      )
      setEditingId(null)
      setEditData({})
      setMessage({
        type: 'success',
        text: 'Listing updated successfully',
      })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update listing',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePublish = async (id: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to publish listing')
      }

      const { listing: updatedListing } = await response.json()
      setListings((prev) =>
        prev.map((l) => (l.id === id ? updatedListing : l))
      )
      setMessage({
        type: 'success',
        text: 'Listing published successfully',
      })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to publish listing',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReject = async (id: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: false }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject listing')
      }

      setListings((prev) => prev.filter((l) => l.id !== id))
      setMessage({
        type: 'success',
        text: 'Listing rejected',
      })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to reject listing',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div>
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-eden-tidal/10 border border-eden-tidal text-eden-tidal'
            : 'bg-eden-redwood/10 border border-eden-redwood text-eden-redwood'
        }`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Search by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-eden-jungle border border-eden-marigold/20 rounded-lg text-eden-orchid placeholder-eden-gray focus:outline-none focus:border-eden-marigold"
        />

        <div className="flex gap-2">
          {(['all', 'pending', 'published', 'rejected'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-eden-marigold text-white'
                  : 'bg-eden-jungle text-eden-gray hover:text-eden-marigold'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-eden-jungle rounded-lg border border-eden-marigold/20 overflow-hidden">
        {filteredListings.length === 0 ? (
          <div className="p-8 text-center text-eden-gray">
            No listings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-eden-lush/50 border-b border-eden-marigold/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-eden-marigold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-eden-marigold">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-eden-marigold">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-eden-marigold">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-eden-marigold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="border-b border-eden-marigold/10 hover:bg-eden-lush/30 transition"
                  >
                    <td className="px-6 py-4">
                      {editingId === listing.id ? (
                        <input
                          type="text"
                          value={editData.name || ''}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1 bg-eden-jungle border border-eden-marigold/20 rounded text-eden-orchid"
                        />
                      ) : (
                        <span className="font-medium text-eden-orchid">{listing.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-eden-gray capitalize">{listing.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-eden-gray">
                        {listing.city}, {listing.state}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          listing.published
                            ? 'bg-eden-tidal/10 text-eden-tidal'
                            : 'bg-eden-marigold/10 text-eden-marigold'
                        }`}
                      >
                        {listing.published ? 'Published' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === listing.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSave(listing.id)}
                            disabled={isUpdating}
                            className="px-3 py-1 bg-eden-tidal text-white rounded text-sm hover:bg-eden-tidal/90"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={isUpdating}
                            className="px-3 py-1 bg-eden-jungle text-eden-gray rounded text-sm hover:text-eden-orchid"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {!listing.published && (
                            <button
                              onClick={() => handlePublish(listing.id)}
                              disabled={isUpdating}
                              className="px-3 py-1 bg-eden-tidal text-white rounded text-sm hover:bg-eden-tidal/90"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(listing)}
                            className="px-3 py-1 bg-eden-jungle text-eden-marigold rounded text-sm hover:bg-eden-jungle/80"
                          >
                            Edit
                          </button>
                          {!listing.published && (
                            <button
                              onClick={() => handleReject(listing.id)}
                              disabled={isUpdating}
                              className="px-3 py-1 bg-eden-redwood/10 text-eden-redwood rounded text-sm hover:bg-eden-redwood/20"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-eden-gray">
        Showing {filteredListings.length} of {listings.length} listings
      </div>
    </div>
  )
}
