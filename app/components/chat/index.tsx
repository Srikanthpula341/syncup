import ChatHeader from './ChatHeader'
import ChatList from './ChatList'
import MessageInput from './MessageInput'
import MessageList from './MessageList'

const ChatComponent = () => {
  return (
    <>

      <div className="h-screen flex overflow-hidden bg-gray-100">

        {/* Sidebar (desktop only) */}
        <div className="hidden md:flex w-80 bg-white border-r flex-col">
          <ChatList />
        </div>

        <div className="flex-1 flex flex-col">
          <div className='flex flex-col h-full bg-white'>
            {/* Mobile Back Button */}
            <div className="md:hidden p-2 border-b">
              <button >⬅ Back</button>
            </div>
            <ChatHeader />
            <MessageList />
            <MessageInput />
          </div>
        </div>
      </div>

    </>
  )
}

export default ChatComponent