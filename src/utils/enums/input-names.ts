export enum inputNames {
  // add-edit-product
  main = "main_cat",
  sub = "sub_cat",
  title = "title",
  price = "price",
  desc = "description",
  colorName = "colorName",
  colorCode = "colorCode",
  removeColor = "removeColor",
  imagesCount = "imagesCount",
  addImage = "add-image",
  replaceImage = "replaceImage",
  removeImage = "removeImage",
  small = "small",
  medium = "medium",
  large = "large",

  // user info
  email = "email",
  password = "password",
  confirm_password = "confirm_password",
  first_name = "first_name",
  last_name = "last_name",
  address_1 = "address_1",
  address_2 = "address_2",
  city = "city",
  state = "state",
  zip_code = "zip_code",
  phone = "phone",

  // cart
  size = "size",
  quantity = "quantity",
}

export const addressFields = [
  inputNames.first_name,
  inputNames.last_name,
  inputNames.address_1,
  inputNames.address_2,
  inputNames.state,
  inputNames.city,
  inputNames.zip_code,
];

export const contactFields = [inputNames.email, inputNames.phone];
