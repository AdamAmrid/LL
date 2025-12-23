import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Send, User, MessageSquare, ArrowLeft, MoreVertical, Phone, Video, Trash2 } from 'lucide-react'

export default function ChatPage() {
    const { chatId } = useParams()
    const navigate = useNavigate()
    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [activeChat, setActiveChat] = useState(null)
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user)
            } else {
                navigate('/login')
            }
        })
        return () => unsubscribeAuth()
    }, [navigate])

    // Fetch All User's Chats
    useEffect(() => {
        if (!currentUser) return

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', currentUser.uid),
            orderBy('lastMessageTimestamp', 'desc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setChats(chatList)
            setLoading(false)
        }, (err) => {
            console.error("Error fetching chats:", err)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [currentUser])

    // Select Chat based on URL or first available
    useEffect(() => {
        if (!loading && chats.length > 0) {
            if (chatId) {
                const selected = chats.find(c => c.id === chatId)
                if (selected) setActiveChat(selected)
            } else {
                // No chat selected state
                setActiveChat(null)
            }
        }
    }, [chatId, chats, loading])

    // Fetch Messages for Active Chat
    useEffect(() => {
        if (!activeChat) return

        const q = query(
            collection(db, 'chats', activeChat.id, 'messages'),
            orderBy('createdAt', 'asc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }))
            setMessages(msgs)
            scrollToBottom()
        })

        return () => unsubscribe()
    }, [activeChat])

    const scrollToBottom = () => {
        if (messagesEndRef.current?.parentElement) {
            messagesEndRef.current.parentElement.scrollTop = messagesEndRef.current.parentElement.scrollHeight
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeChat || !currentUser) return

        try {
            const msgText = newMessage.trim()
            setNewMessage('') // Optimistic clear

            // 1. Add Message
            await addDoc(collection(db, 'chats', activeChat.id, 'messages'), {
                text: msgText,
                senderId: currentUser.uid,
                createdAt: serverTimestamp(),
                read: false
            })

            // 2. Update Chat Metadata
            await updateDoc(doc(db, 'chats', activeChat.id), {
                lastMessage: msgText,
                lastMessageTimestamp: serverTimestamp(),
                // Simplistic unread count logic
                [`unreadCount.${getOtherUserId(activeChat)}`]: (activeChat.unreadCount?.[getOtherUserId(activeChat)] || 0) + 1
            })

        } catch (err) {
            console.error("Error sending message:", err)
        }
    }

    const getOtherUserId = (chat) => {
        return chat.participants.find(uid => uid !== currentUser.uid)
    }

    const getOtherUserName = (chat) => {
        if (!chat || !currentUser) return 'Chat'

        // Helper to format email to name
        const formatNameFromEmail = (email) => {
            if (!email) return ''
            return email.split('@')[0]
                .split('.')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ')
        }

        if (currentUser.uid === chat.requesterId) {
            return chat.helperName || formatNameFromEmail(chat.helperEmail) || 'Helper'
        }
        return chat.requesterName || formatNameFromEmail(chat.requesterEmail) || 'Student'
    }

    const getOtherUserEmail = (chat) => {
        if (!chat || !currentUser) return ''
        if (currentUser.uid === chat.requesterId) return chat.helperEmail
        return chat.requesterEmail
    }

    const handleDeleteClick = () => {
        setDeleteConfirmation(true)
    }

    const confirmDeleteChat = async () => {
        if (!activeChat || !currentUser) return

        try {
            // Optimistic Update: Remove from list immediately
            setChats(prev => prev.filter(c => c.id !== activeChat.id))
            setDeleteConfirmation(false)
            navigate('/chat')

            const chatRef = doc(db, 'chats', activeChat.id)
            const updatedParticipants = activeChat.participants.filter(p => p !== currentUser.uid)
            await updateDoc(chatRef, {
                participants: updatedParticipants
            })
        } catch (err) {
            console.error("Error deleting chat:", err)
            // Ideally revert optimistic update here if needed (refetch listener will handle it though)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center pt-20">
                <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="bg-gray-50 pb-0 flex flex-col h-[calc(100vh-5rem)]">
            <div className="flex-grow flex overflow-hidden">
                {/* Sidebar (Chat List) */}
                <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col bg-white border-r border-gray/10`}>
                    <div className="p-4 border-b border-gray/10 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                            <MessageSquare className="text-accent" size={24} />
                            Messages
                        </h2>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        {chats.length === 0 ? (
                            <div className="p-8 text-center text-gray">
                                <p>No conversations yet.</p>
                            </div>
                        ) : (
                            chats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => navigate(`/chat/${chat.id}`)}
                                    className={`w-full p-4 border-b border-gray/5 text-left transition-colors hover:bg-gray-50 flex gap-3 ${activeChat?.id === chat.id ? 'bg-accent/5 border-l-4 border-l-accent' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500">
                                        <User size={20} />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-semibold text-dark truncate">
                                                {getOtherUserName(chat)}
                                            </h3>
                                            <span className="text-xs text-gray/50">
                                                {chat.lastMessageTimestamp?.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray/70 truncate">
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                {activeChat ? (
                    <div className="flex-1 flex flex-col bg-white w-full">
                        {/* Chat Header */}
                        <div className="h-16 border-b border-gray/10 flex items-center justify-between px-4 bg-white z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="md:hidden p-2 -ml-2 text-gray hover:text-dark"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-dark">{getOtherUserName(activeChat)}</h3>
                                    <p className="text-xs text-gray">{getOtherUserEmail(activeChat)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray">
                                <button
                                    onClick={handleDeleteClick}
                                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                                    title="Delete Conversation"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-hide">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === currentUser.uid
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe
                                                ? 'bg-accent text-white rounded-br-none shadow-md shadow-accent/20'
                                                : 'bg-white text-dark border border-gray/10 rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray/50'}`}>
                                                {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray/10">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-grow px-4 py-3 bg-gray-50 border border-gray/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-3 bg-accent text-white rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-accent/20"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    // Empty State (Desktop)
                    <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 flex-col text-gray-400">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={48} className="opacity-20" />
                        </div>
                        <p className="text-lg font-medium">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-2">Delete Conversation?</h3>
                            <p className="text-gray text-sm mb-6">
                                Are you sure you want to delete this conversation? It will be removed from your list.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmation(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray/20 text-dark font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteChat}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
