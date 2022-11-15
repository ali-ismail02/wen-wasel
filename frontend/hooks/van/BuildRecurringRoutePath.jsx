import SortPath from "./SortPath";

const BuildRecurringRoutePath = async ( presaved_route, setPath ) => {
    const path = [];
    presaved_route.routes.forEach(route => {
        // date = current time + route.route.time_difference (in minutes)
        const date = new Date(new Date().getTime() + route.route.time_difference * 60000);
        const time = date.toLocaleTimeString();
        const dateStr = date.toLocaleDateString();
        console.log(date);
        const destination = [
            {
                latitude:route.route.location.split(",")[0],
                longitude:route.route.location.split(",")[1],
                id:route.route.id,
                arrived:false
            },
            dateStr + " " + time
        ]

        path.push(destination);
    });
    setPath(SortPath(path));
    return path;
}

export default BuildRecurringRoutePath;