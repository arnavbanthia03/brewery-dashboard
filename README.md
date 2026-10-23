# Brewery Dashboard

**Topic 13: React Dashboard Consuming an API**

A responsive React dashboard that pulls data from the [Open Brewery DB API](https://api.openbrewerydb.org/v1/breweries). You can search breweries by name, browse them as cards, and see a bar chart of how many breweries there are per type. Built with React, Vite and Recharts, styled in plain CSS with a white and orange theme.

## Team Members & Roles

| Name            | Project Role                         |
| --------------- | ------------------------------------ |
| Arnav Banthia   | Frontend Developer                   |
| [Member 2 Name] | [Role, e.g. UI/UX Designer]          |
| [Member 3 Name] | [Role, e.g. Documentation & Testing] |

## Architecture

```
+-----------------------------------------------+
|                 React Frontend                |
|                                               |
|  App.jsx  (state: breweries, loading, error,  |
|            searchTerm)                        |
|    |                                          |
|    |-- useEffect --> fetch() ---------------+ |
|    |                                        | |
|    |-- props --> SearchBar                  | |
|    |-- props --> TypeChart (Recharts)       | |
|    |-- props --> BreweryCard (x many)       | |
|    '-- props --> StatusMessage              | |
+-----------------------------------------------+
                                              |
        GET /v1/breweries?per_page=50&by_name=...
                                              v
                    +--------------------------------+
                    |   Open Brewery DB (REST API)   |
                    +--------------------------------+
                                              |
                       JSON array of breweries
                                              v
          setBreweries(data) -> React re-renders the UI
```

1. The user types in the search box, which updates the `searchTerm` state.
2. After a short pause, `useEffect` sends a `fetch` request to the API.
3. The JSON response is saved with `setBreweries`, and React re-renders the chart and cards.

## Setup Steps

```bash
# 1. Create the project
npm create vite@latest brewery-dashboard -- --template react
cd brewery-dashboard

# 2. Install dependencies
npm install
npm install recharts

# 3. Copy in the project files (replace the defaults), then delete src/App.css

# 4. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

## Screenshots

![Dashboard View](link-to-dashboard-screenshot)

![Search Results](link-to-search-screenshot)

![Empty and Error States](link-to-states-screenshot)

## Research Questions

### How do `useState` and `useEffect` work together for data fetching?

The way I think about it is that `useState` is where the data lives and `useEffect` is what goes and gets it. When the component first loads, I have empty state (an empty array for breweries, `loading` set to true). Then `useEffect` runs after the first render, calls `fetch`, and when the response comes back I call a setter like `setBreweries(data)`. Changing state makes React re-render, so the cards and chart appear with the new data.

The dependency array at the end of `useEffect` controls when it runs again. In my app it's `[debouncedTerm, retryCount]`, so a new request goes out whenever the search term settles or the user clicks "Try again". If I left the array empty, the fetch would only run once. The cleanup function (where I call `controller.abort()`) cancels the old request when a new one starts, so an old slow response can't overwrite newer results.

### Why use components and props?

Components let me break the page into small pieces that each do one job: `SearchBar`, `BreweryCard`, `TypeChart` and `StatusMessage`. That keeps `App.jsx` readable, and I can reuse a piece, like rendering `BreweryCard` once for every brewery in the array, without copying code.

Props are how those pieces get their data. `App` keeps all the state and passes what each child needs down, for example `<BreweryCard brewery={brewery} />`. The child just displays what it receives, which makes it easy to test and change. For the search box, `App` passes down `value` and `onChange`, so the state stays in one place and the child just reports what the user typed.

### How do you handle loading, errors and empty states?

I handle all three with state, and then decide what to show before rendering the data. I have `loading` (true while the request is running) and `error` (a message if something failed). Before every fetch I set `loading` to true and clear the error, and in a `finally` block I set `loading` to false so it always turns off whether the request worked or not.

For errors, I wrap the fetch in `try/catch`. One thing I learned is that `fetch` doesn't throw on a 404 or 500, so I check `response.ok` myself and throw an error if it's false. The error state shows a clear message and a "Try again" button.

The empty state is different, because nothing actually went wrong: the API just returned an empty array. So after loading and error are ruled out, I check `breweries.length === 0` and show a "No breweries match" message with a button to clear the search. The order matters (loading, then error, then empty, then the real data), otherwise the user could briefly see "no results" while the data is still loading.
