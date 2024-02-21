const vertexShader2 = `
varying vec2 vUv;

void main(){
	vUv = uv;
	gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0);
}
`;

const fragmentShader2 = `

#define PI 3.14159265359

varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;
uniform bool u_clic;
uniform vec2 u_pointer;
uniform vec3 u_color;

float sdfCircle(vec2 p, vec2 o, float r){
	return length(p-o)-r;
}

float sdfPetals(vec2 p, vec2 o, float R, float r, float n){
    vec2 pos = p-o;
	float c = sdfCircle(p, o, R);
    float pt = abs(atan(pos.y, pos.x));
    pt = r*cos(n*pt);
    return c + pt;
}

float sdfM2(vec2 p, vec2 o, float R, float r, float n){
    vec2 pos = p-o;
	float c = sdfCircle(p, o, R);
    // float pt = r*cos(n*atan(pos.y, pos.x));
    float pt = abs(atan(pos.y, pos.x));
    pt = r*(cos(n*pt) + sin(n*pt));
    return c + pt;
}
float sdfMyFigure(vec2 p, vec2 o, float r, float n){
	float d = length(p-o)-r;
	vec2 S = o + normalize(p-o)*r;
	vec2 Cx = o + vec2(r, 0.);
	float Px = dot(S, Cx)/r;
	float M = 0.15*cos(PI*Px*n);
	// return length(p-o)-r;
	return d - M;
}

float dot2(vec2 v){
    return dot(v, v);
}

float sdfHeart( vec2 p, vec2 o )
{
    p = p-o;
    p.x = abs(p.x);

    if( p.y+p.x>1.0 )
        return sqrt(dot2(p-vec2(0.25,0.75))) - sqrt(2.0)/4.0;
    return sqrt(min(dot2(p-vec2(0.00,1.00)),
                    dot2(p-0.5*max(p.x+p.y,0.0)))) * sign(p.x-p.y);
}

float sdfCapsule(vec2 p, vec2 a, vec2 b, float r){
	vec2 ab = b-a;
	vec2 ap = p-a;
	float t = dot(ab, ap)/dot(ab, ab);
	t= clamp(t, 0., 1.);
	vec2 c = a+t*ab;
	return length(p-c)-r;
}
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
float getDist(vec2 p){
	float d1 = sdfHeart(p, vec2(-.5, -.5));
	float d2 = sdfCircle(p, vec2(0., 0.), .6);
	float d3 = sdfPetals(p, vec2(0.), .6, .3, 7.);
	// float d3 = sdfCapsule(p, vec2(.9 + .15*cos(u_time/30.), -.6), vec2(1.2, .4), .35);
	float d = smin(d1, d2, 0.2);
	// float d = sdfMyFigure(p, vec2(0.), .8, 6.);
	// float d = sdfM2(p, vec2(0.), .6, 0.2, 4.);
	// d = smin(d, d3, 0.2);

	return d3;
}

vec2 screenN (vec2 uv,vec2 res) {
	float asp = res.x/res.y;
	vec2 aux = vec2((uv.x-.5)*asp, uv.y-.5)*2.; 
	return aux;
}

void main()	{
	vec2 p = screenN(vUv ,u_resolution);
	vec2 pointer = screenN(u_pointer, u_resolution);
	vec3 cl = u_color/255.0;

	float d = getDist(p);
	vec3 col = (d>0.0) ? cl : vec3(0.9,0.2,0.);
	col *= 1.0 - exp(-6.0*abs(d));
	col *= 1.0 - .5*cos(50.0*abs(d)-u_time);	
	col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(d)) );
	float mc;
	if (u_clic){
		d = getDist(pointer);
		mc = sdfCircle(p, pointer, abs(d));
		col = mix(col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0, 0.005, abs(mc)-0.0025));
    	col = mix(col, vec3(1.0,1.0,0.0), 1.0-smoothstep(0.0, 0.005, sdfCircle(p, pointer, 0.02)));
	}
	gl_FragColor = vec4(col ,1.0 );
}
`;

export {vertexShader2, fragmentShader2};