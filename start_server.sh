cd /root/server
npm install

if [ $DEV ]
then 
    npm run dev
else 
    echo "Production";
    node ${YB_SCRIPT}
fi