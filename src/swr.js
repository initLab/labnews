import useSWR from 'swr';

async function fetcher(input, init) {
    const response = await fetch(input, init);

    if (!response.ok) {
        throw new Error('Fetch error: ' + response.statusText + ' (' + response.status + ')');
    }

    return await response.text();
}

export default function useFetch(url, options = {}) {
    return useSWR(url, fetcher, options);
}
