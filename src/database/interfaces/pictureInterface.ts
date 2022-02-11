interface PictureInterface {
  id?: string;
  _id?: string;
  description: string;
  pictureDate?: Date;
  userId?: string;
  messageId: string[];
  urlPicture: string;
}
export default PictureInterface;
