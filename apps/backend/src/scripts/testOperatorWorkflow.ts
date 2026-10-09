import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function runOperatorWorkflowVerification() {
  console.log('====================================================');
  console.log('STARTING ITINERA OPERATOR WORKFLOW VERIFICATION TEST');
  console.log('====================================================\n');

  // STEP 1: Traveler creates a trip
  console.log('1. Traveler creates a dynamic trip...');
  const travelerPayload = {
    destination: 'Santorini, Greece',
    days: 4,
    travelerName: 'Marcus Vance',
    budget: 'luxury',
    travelerStyle: 'Aegean Sailing & Sunset Gastronomy',
    prompt: 'Private catamaran charter to volcanic caldera, cliffside Oia cave suite, and wine tasting.',
  };

  const intakeRes = await axios.post(`${BASE_URL}/gemini/intake`, travelerPayload);
  if (!intakeRes.data.success || !intakeRes.data.itinerary) {
    throw new Error('Traveler trip generation failed.');
  }
  const createdTrip = intakeRes.data.itinerary;
  console.log(`✓ Trip Created successfully: ID=${createdTrip.id}, Title="${createdTrip.title}", Traveler="${createdTrip.travelerName}", TotalCost=$${createdTrip.totalCost}`);

  // STEP 2: Verify trip appears in Operator Tours Manifest
  console.log('\n2. Operator fetches active tours manifest...');
  const toursRes = await axios.get(`${BASE_URL}/operator/tours`);
  if (!toursRes.data.success || !Array.isArray(toursRes.data.tours)) {
    throw new Error('Failed to retrieve operator tours.');
  }
  const matchingTour = toursRes.data.tours.find((t: any) => t.tripId === createdTrip.id);
  if (!matchingTour) {
    throw new Error(`Created trip ${createdTrip.id} NOT found in operator tours list!`);
  }
  console.log(`✓ VERIFIED: Traveler trip appears in Operator View!`);
  console.log(`  - Tour ID: ${matchingTour.id}`);
  console.log(`  - Traveler: ${matchingTour.travelerName}`);
  console.log(`  - Destination: ${matchingTour.destination}`);
  console.log(`  - Components count: ${matchingTour.componentCount}`);
  console.log(`  - Total Cost: $${matchingTour.totalCost}`);
  console.log(`  - Status: ${matchingTour.status}`);

  // STEP 3: Fetch full Tour Operations Detail
  console.log('\n3. Operator inspects tour details, vendor assignments & bookings...');
  const detailRes = await axios.get(`${BASE_URL}/operator/tours/${createdTrip.id}`);
  if (!detailRes.data.success || !detailRes.data.tour) {
    throw new Error('Failed to retrieve tour operations detail.');
  }
  const tourDetail = detailRes.data.tour;
  console.log(`✓ Tour details loaded with ${tourDetail.bookings.length} component bookings:`);
  
  const firstBooking = tourDetail.bookings[0];
  console.log(`  - Sample Booking: [${firstBooking.bookingRef}] ${firstBooking.componentName}`);
  console.log(`    Vendor: ${firstBooking.vendor} (${firstBooking.vendorRating}★)`);
  console.log(`    Cost: $${firstBooking.cost} ${firstBooking.currency}`);
  console.log(`    Simulated Payment Status: ${firstBooking.paymentStatus}`);

  // STEP 4: Operator modifies simulated payment status (Paid -> Escrow)
  console.log('\n4. Operator updates booking simulated payment status to "escrow"...');
  const updatePayRes = await axios.patch(
    `${BASE_URL}/operator/tours/${createdTrip.id}/bookings/${firstBooking.componentId}`,
    { paymentStatus: 'escrow' },
    { headers: { 'x-user-role': 'operator' } }
  );
  if (!updatePayRes.data.success) {
    throw new Error('Failed to update payment status.');
  }
  const updatedTour = updatePayRes.data.tour;
  const updatedBooking = updatedTour.bookings.find((b: any) => b.componentId === firstBooking.componentId);
  console.log(`✓ Booking payment status updated to: ${updatedBooking.paymentStatus}`);
  console.log(`✓ Financial Escrow Recalculated: Escrow Total = $${updatedTour.escrowTotal}, Paid Total = $${updatedTour.paidTotal}`);

  // STEP 5: Operator manages vendor inventory
  console.log('\n5. Operator inspects and edits vendor inventory...');
  const vendorsRes = await axios.get(`${BASE_URL}/operator/vendors`);
  if (!vendorsRes.data.success || vendorsRes.data.vendors.length === 0) {
    throw new Error('Failed to retrieve vendor inventory.');
  }
  console.log(`✓ Total Partner Vendors: ${vendorsRes.data.vendors.length}`);
  const targetVendor = vendorsRes.data.vendors[0];
  console.log(`  - Updating Vendor: ${targetVendor.vendorName} (Current Capacity: ${targetVendor.capacityPerDay}, UnitPrice: $${targetVendor.unitCost})`);

  const updateVendorRes = await axios.put(
    `${BASE_URL}/operator/vendors/${targetVendor.id}`,
    {
      unitCost: targetVendor.unitCost + 25,
      capacityPerDay: targetVendor.capacityPerDay + 10,
      slaStatus: 'healthy',
      contractStatus: 'active',
    },
    { headers: { 'x-user-role': 'operator' } }
  );
  if (!updateVendorRes.data.success) {
    throw new Error('Failed to update vendor inventory.');
  }
  const savedVendor = updateVendorRes.data.vendor;
  console.log(`✓ Vendor Inventory Updated: New UnitPrice=$${savedVendor.unitCost}, New Capacity=${savedVendor.capacityPerDay}, SLA=${savedVendor.slaStatus}`);

  // STEP 6: Operator creates a new partner vendor
  console.log('\n6. Operator adds a new partner vendor...');
  const newVendorRes = await axios.post(
    `${BASE_URL}/operator/vendors`,
    {
      vendorName: 'Aegean Blue Catamaran Charters',
      category: 'transport',
      serviceTitle: 'Private Luxury Catamaran Sunset Sail',
      location: 'Amoudi Bay, Santorini',
      unitCost: 450,
      capacityPerDay: 6,
      contactEmail: 'charters@aegeanblue.gr',
    },
    { headers: { 'x-user-role': 'operator' } }
  );
  if (!newVendorRes.data.success) {
    throw new Error('Failed to create partner vendor.');
  }
  console.log(`✓ New Partner Vendor Created: ID=${newVendorRes.data.vendor.id}, Name="${newVendorRes.data.vendor.vendorName}"`);

  console.log('\n====================================================');
  console.log('ALL OPERATOR DASHBOARD WORKFLOW TESTS PASSED 100%!');
  console.log('====================================================\n');
}

runOperatorWorkflowVerification().catch((err) => {
  console.error('Verification error:', err.message);
  process.exit(1);
});
