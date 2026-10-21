// Build-only fallback for source validation when React Router is unavailable locally.
// Normal app runs use react-router-dom from the declared package dependency.
import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
const C=createContext(null);
function readLocation(){return {pathname:window.location.pathname,search:window.location.search};}
export function BrowserRouter({children}){const [location,setLocation]=useState(readLocation);useEffect(()=>{const fn=()=>setLocation(readLocation());window.addEventListener('popstate',fn);return()=>window.removeEventListener('popstate',fn)},[]);const value=useMemo(()=>({location,navigate(to){window.history.pushState({},'',to);setLocation(readLocation())}}),[location]);return <C.Provider value={value}>{children}</C.Provider>}
export function useLocation(){return useContext(C).location}
export function useNavigate(){return useContext(C).navigate}
export function Link({to,children,onClick,...props}){const navigate=useNavigate();return <a href={to} {...props} onClick={e=>{onClick?.(e);if(!e.defaultPrevented&&!e.metaKey&&!e.ctrlKey){e.preventDefault();navigate(to)}}}>{children}</a>}
export function Route(){return null}
export function Routes({children}){const {location}=useContext(C);const pathname=location.pathname;const route=React.Children.toArray(children).find(child=>match(child.props.path,pathname));if(!route)return null;const params=match(route.props.path,pathname);return <P.Provider value={params}>{route.props.element}</P.Provider>}
const P=createContext({});export function useParams(){return useContext(P)}
function match(pattern,path){
  if(pattern==='*')return {};
  const names=[];let source='';
  for(const part of pattern.split('/').filter(Boolean)){
    if(part.startsWith(':')){const optional=part.endsWith('?');names.push(part.slice(1,optional?-1:undefined));source+=optional?'(?:/([^/]+))?':'/([^/]+)'}
    else source+='/'+part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  }
  const hit=path.match(new RegExp('^'+(source||'/')+'/?$'));if(!hit)return null;
  return Object.fromEntries(names.map((name,i)=>[name,hit[i+1]]).filter(([,value])=>value!==undefined));
}
