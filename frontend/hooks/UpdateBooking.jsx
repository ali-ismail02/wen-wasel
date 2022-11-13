import Put from "./Put";

const UpdateBooking = (booking) => {
    const data = {
        reservation_id: booking
    }
    const response = Put("user/update-reservation", data, jwt);

    if (response.data.status == "success") {
        return true;
    }
    return false;
}

export default UpdateBooking;