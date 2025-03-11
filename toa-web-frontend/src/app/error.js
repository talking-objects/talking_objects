"use client"

import NotFoundWrapper from "./components/notfound/NotFoundWrapper";

const Custom500 = ({ error, reset }) => {

  const text = {
    title: "Something went wrong!",
    text1: "Oops! Something went wrong on our end.",
    text2: `The page you’re looking for can’t be displayed right now. It could be due to a temporary server issue or something unexpected on our side.
But don’t worry, we’re working on it! If the problem persists, feel free to contact us for assistance.`
    }

    return <NotFoundWrapper text={text} notfound={false} reset={reset} />
}

export default Custom500;