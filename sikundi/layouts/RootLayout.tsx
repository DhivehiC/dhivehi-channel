
import Notification from '@sikundi/components/Notification'
import { FC, ReactNode, useState, createContext, useEffect, Fragment } from 'react'

interface Props {
    children: ReactNode,
}

interface Notification {
    id: string,
    title: string,
    content?: string,
    type?: 'success' | 'failed',
}

export const LocaleContext = createContext<any>(null)
export const NotificationContext = createContext<any>(null)

const RootLayout:FC<Props> = ({ children }) => {
    const [ notification, setNotification ] = useState<Notification | null>(null)
    const [active, setActive] = useState(false)
    useEffect(()=>{
        if (notification?.title) {
            setActive(true)
            setTimeout(()=>{
                setActive(false)
                setNotification(null)
            }, 3000)
        }
    }, [notification])
    
    return (
        <Fragment>
            <NotificationContext.Provider value={[ notification, setNotification ]}>
                {children}
            </NotificationContext.Provider>
            
            <Notification title={notification?.title} content={notification?.content} type={notification?.type} active={active} />
        </Fragment>
    )
}

export default RootLayout