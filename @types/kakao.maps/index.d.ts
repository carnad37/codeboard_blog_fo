declare namespace kakao.maps{

    export function load(callback : ()=>void): void;

    export class Map {
        constructor(public targetTag : HTMLDivElement, options : any )
    }

    export class LatLng {
        constructor(public lat : number, lng : number)
    }

}