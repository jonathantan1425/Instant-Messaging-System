cd ./rpc-server
kitex -module "github.com/TikTokTechImmersion/assignment_demo_2023/rpc-server" -service imservice ../idl_rpc.thrift
cd ../http-server
kitex -module "github.com/TikTokTechImmersion/assignment_demo_2023/http-server" -service imservice ../idl_rpc.thrift
