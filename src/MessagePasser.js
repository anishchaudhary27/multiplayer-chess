import { Subject } from 'rxjs'

const subject = new Subject()

export const MessagePasser = {
    sendMessage: message => subject.next({ text: message }),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable()
}