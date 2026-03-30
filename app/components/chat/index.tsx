'use client'
import { useAppSelector } from '@/app/store/hooks'
import ChatHeader from './ChatHeader'
import ChatList from './ChatList'
import MessageInput from './MessageInput'
import MessageList from './MessageList'
import ThreadSidebar from './ThreadSidebar'

const ChatComponent = () => {
  const { isThreadOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 font-sans">
      {/* Sidebar (desktop only) */}
      <div className="hidden lg:flex w-80 bg-white border-r flex-col">
        <ChatList />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <ChatHeader />
          <MessageList />
          <MessageInput />
        </div>

        {/* Thread Sidebar */}
        {isThreadOpen && <ThreadSidebar />}
      </div>
    </div>
  )
}

export default ChatComponent