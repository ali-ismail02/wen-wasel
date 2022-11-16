import Post from "../Post";

const RegisterVan = async (name, phone, email, password, license_plate, license, front_image, side_image, make, model, year) => {
    const data = { name, phone, email, password, license_plate, license, front_image, side_image, make, model, year };
    const response = await Post("van/signup", data);
    if(response){
        return response.data;
    }
    return null;
}