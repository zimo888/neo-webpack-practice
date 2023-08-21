import React from 'react';
const Class2 = React.lazy(() => import('.'));
export default class AsyncModule extends React.Component{
    render() {
        return (
            <React.Suspense fallback={<div>Loading...</div>}>
                <Class2 />
            </React.Suspense>
        )
    }
}