## Slot Booking Service

### Need
- A slot is a 2 hour window. The available slots are from 9 AM to 6 PM with no slot for 1PM to 2PM. 
- There are 4 vans available, each van can hold 20 cartons and each carton’s height, width and breadth are 15”, 30” and 15” respectively.
- Build a REST based service to book the slot.
- Build a REST based service to provide the slot information for any order. An order has a set of item and each item has a height, width and breadth. 
- Feel free to implement any improvement you see fit for this application

### Assumptions
- Orders are created independent of slots
- A Slot is booked for a confirmed order (Hence there is no confirming or canceling of order, while finding available slot) 
- The API is expected to return the best immediate available slot for the specified order or book a immediate available order 
- The API is expected can also support list of orders, so that orders belonging to closer by address can be booked to same slot (assuming grouping the order by their address is outside the scope of this slot allocating module)
- The APIs (system) will only give slot booking current day(today) and for the next X days, not any earlier to it  (Order has to be slotted for a current day or future, never in a past date)
- Not considering max vans for slotting, instead considering as Slot capacity, which is equal to maximum cartons per slot we can fit it, so that logistics of vans can be kept extensible and abstracted 

- At End-Of-Day a separate process is run, which initializes the day's slots 