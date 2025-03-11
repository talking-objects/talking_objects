import NotFoundWrapper from "./components/notfound/NotFoundWrapper";

const NotFoundPage = () => {
    const text = {
        title: "404: Page not found",
        text1: "Oops! The page you're looking for doesn't seem to exist.",
        text2: `It may have been moved, deleted, or the URL might be incorrect.
But don’t worry, let’s get you back on track!`
    }
    return <NotFoundWrapper text={text} notfound={true} />
}

export default NotFoundPage;