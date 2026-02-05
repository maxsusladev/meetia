
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

import {
    MeetingsIdViewError,
    MeetingsIdViewLoading,
    MeetingsView
} from "@/modules/meetings/ui/views/meetings-view"

const Page = () => {

    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    )


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsIdViewLoading />}>
                <ErrorBoundary fallback={<MeetingsIdViewError />}>
                    <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page


