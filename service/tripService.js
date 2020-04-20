const TripService = () => {
    let subscribers = []

    return {
      subscribe: (sub) => subscribers.push(sub),
      setLocation: (trip) => {
        subscribers.forEach((sub) => sub(trip))
      },
      unsubscribe: (sub) => {
        subscribers = subscribers.filter((_sub) => _sub !== sub)
      }
    }
  }
  
export const tripService = TripService();