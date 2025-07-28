"use client"

import { useState, useEffect } from "react"
import { Search, User, Phone } from "lucide-react"
import type { Client } from "@/lib/types"
import { clients } from "@/data/clients"

interface ClientSearchProps {
  selectedClient: Client | null
  onClientSelect: (client: Client) => void
}

export default function ClientSearch({ selectedClient, onClientSelect }: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients)

  useEffect(() => {
    const filtered = clients.filter(
      (client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.phone.includes(searchTerm),
    )
    setFilteredClients(filtered)
  }, [searchTerm])

  const handleClientSelect = (client: Client) => {
    onClientSelect(client)
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients by name or phone..."
          value={selectedClient ? selectedClient.name : searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
            if (selectedClient) onClientSelect(null as any)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isOpen && !selectedClient && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => handleClientSelect(client)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
              >
                <User className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{client.phone}</p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">No clients found matching "{searchTerm}"</div>
          )}
        </div>
      )}

      {selectedClient && (
        <div className="mt-2 p-3 bg-blue-50 rounded-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">{selectedClient.name}</p>
              <p className="text-xs text-blue-600">{selectedClient.phone}</p>
            </div>
          </div>
          <button onClick={() => onClientSelect(null as any)} className="text-blue-600 hover:text-blue-800 text-sm">
            Change
          </button>
        </div>
      )}
    </div>
  )
}
