interface MessageInterface {
  id?: string;
  _id?: string;
  messageText: string;
  pictureId?: string;
  messageDate?: Date;
  userId?: string;
}
export default MessageInterface;
