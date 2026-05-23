let bookingCarId = null;

function openBookingModal(carId) {
  if (!currentUser) {
    showToast("⚠ Please login to book a car", true);
    openModal("loginModal");
    return;
  }

  const car = cars.find(c => c.id === carId);
  if (!car) return;

  if (car.isBooked) {
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

async function confirmBooking() {
  const start = document.getElementById("booking-start").value;
  const end   = document.getElementById("booking-end").value;

  if (!start || !end) { showToast("⚠ Please select start and end dates", true); return; }
  if (start >= end)   { showToast("⚠ End date must be after start date", true); return; }

  const car = cars.find(c => c.id === bookingCarId);
  if (!car) return;

  try {
    const booking = await apiFetch("/bookings", {
      method: "POST",
      body: JSON.stringify({ carId: bookingCarId, startDate: start, endDate: end })
    });
    bookings.push(booking);
    cars = cars.map(c => c.id === bookingCarId ? { ...c, isBooked: true } : c);
    closeModal("bookingModal");
    bookingCarId = null;
    displayCars();
    showToast(`✅ ${car.make} ${car.model} booked successfully!`);
  } catch (e) {
    showToast(`❌ ${e.message}`, true);
  }
}

async function openBookingsModal() {
  try {
    const data = await apiFetch("/bookings");
    bookings = data;

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
              <th>Car</th><th>User</th><th>Email</th><th>From</th><th>To</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map(b => `
              <tr>
                <td>${b.carName}</td>
                <td>${b.userName}</td>
                <td>${b.userEmail}</td>
                <td>${b.startDate ? b.startDate.split("T")[0] : ""}</td>
                <td>${b.endDate   ? b.endDate.split("T")[0]   : ""}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>`;
    }
  } catch (e) {
    document.getElementById("bookingsContent").innerHTML = `<p>Failed to load bookings.</p>`;
  }

  openModal("bookingsModal");
}
