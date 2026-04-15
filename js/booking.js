let bookingCarId = null;

function openBookingModal(carId) {
  if (!currentUser) {
    showToast("⚠ Please login to book a car", true);
    openModal("loginModal");
    return;
  }

  const car = cars.find(c => c.id === carId);
  if (!car) return;

  const isBooked = bookings.find(b => b.carId === carId);
  if (isBooked) {
    showToast("⚠ This car is already booked", true);
    return;
  }

  bookingCarId = carId;
  document.getElementById("booking-car-name").textContent = `${car.make} ${car.model}`;
  document.getElementById("booking-user").value = currentUser.name;
  document.getElementById("booking-start").value = "";
  document.getElementById("booking-end").value = "";
  openModal("bookingModal");
}

function confirmBooking() {
  const start = document.getElementById("booking-start").value;
  const end = document.getElementById("booking-end").value;

  if (!start || !end) {
    showToast("⚠ Please select start and end dates", true);
    return;
  }
  if (start >= end) {
    showToast("⚠ End date must be after start date", true);
    return;
  }

  const car = cars.find(c => c.id === bookingCarId);
  if (!car) return;

  bookings.push({
    id: Date.now(),
    carId: bookingCarId,
    carName: `${car.make} ${car.model}`,
    userName: currentUser.name,
    userEmail: currentUser.email,
    startDate: start,
    endDate: end
  });

  localStorage.setItem("bookings", JSON.stringify(bookings));
  closeModal("bookingModal");
  bookingCarId = null;
  displayCars();
  showToast(`✅ ${car.make} ${car.model} booked successfully!`);
}

function openBookingsModal() {
  if (bookings.length === 0) {
    document.getElementById("bookingsContent").innerHTML = `
      <div class="empty-state" style="padding:40px 0">
        <div class="empty-icon">📋</div>
        <h3>No Bookings Yet</h3>
        <p>No cars have been booked.</p>
      </div>`;
  } else {
    document.getElementById("bookingsContent").innerHTML = `
      <table class="bookings-table">
        <thead>
          <tr>
            <th>Car</th>
            <th>User</th>
            <th>Email</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(b => `
            <tr>
              <td>${b.carName}</td>
              <td>${b.userName}</td>
              <td>${b.userEmail}</td>
              <td>${b.startDate}</td>
              <td>${b.endDate}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;
  }
  openModal("bookingsModal");
}
