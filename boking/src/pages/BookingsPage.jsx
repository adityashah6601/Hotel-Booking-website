import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get('/bookings').then(response => {
        console.log(bookings)
        setBookings(response.data);
      
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 ? (
          bookings.map(booking => (
            <Link to={`/account/bookings/${booking._id}`} className="flex gap-4  bg-gray-200 rounded-2xl overflow-hidden" key={booking._id}>
              <div className="w-48">
               {booking.place ? (
                  <PlaceImg NewPlace={booking.place} />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl">{booking.place ? booking.place.title : 'Title not available'}</h2>
                <div className=" text-xl">
                  <BookingDates booking={booking} className="mb-2 mt-4  text-gray-600" />
                  <div className="flex gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xl ">
                      Total Price: ₹{booking.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No bookings available</p>
        )}
      </div>
    </div>
  );
}
