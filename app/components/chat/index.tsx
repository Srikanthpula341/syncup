'use client'
import { useAppSelector } from '@/app/store/hooks'
import ChatHeader from './ChatHeader'
import ChatList from './ChatList'
import MessageInput from './MessageInput'
import MessageList from './MessageList'
import ThreadSidebar from './ThreadSidebar'
import WelcomeDashboard from './WelcomeDashboard'
import { cn } from '@/app/lib/utils'

const ChatComponent = () => {
  const { isThreadOpen, activeChannelId } = useAppSelector((state) => state.ui);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 font-sans relative ">
      {/* Sidebar (desktop list, or mobile list when NO channel is active) */}
      <div className={cn(
        "bg-white border-r flex flex-col transition-all duration-300" ,
        activeChannelId ? "hidden lg:flex lg:w-80" : "flex w-full lg:w-80"
      )}>
        <ChatList />
      </div>

      <div className={cn(
        "flex-1 flex overflow-hidden",
        !activeChannelId && "hidden lg:flex"
      )}>
        <div className="flex-1 flex flex-col min-w-0 bg-white  relative h-full">
          {!activeChannelId ? (
            <WelcomeDashboard />
          ) : (
            <>
              <ChatHeader />
              <MessageList />
              <MessageInput />
            </>
          )}
        </div>

        {/* Thread Sidebar */}
        {isThreadOpen && <ThreadSidebar />}
      </div>
    </div>
  )
}

export default ChatComponent