export default class ClassComponent {
    static contextTypes: {
        currentUser: any;
        currentTeam: any;
        location: any;
        router: any;
    };
    static childContextTypes: {
        currentUser: any;
        currentTeam: any;
        location: any;
        router: any;
    };
    props: {};
    render(): any;
}
