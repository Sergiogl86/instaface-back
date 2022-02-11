interface PictureInterface {
  id?: string;
  _id?: string;
  description: string;
  pictureDate?: Date;
  pictureUser?: string;
  urlPicture: string;
  messagePicture?: string[];
}
export default PictureInterface;
