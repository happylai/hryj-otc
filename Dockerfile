FROM nginx
COPY dist /usr/share/nginx/html

#使用自定义nginx.conf配置端口和监听 路由bowseyhistory模式
RUN rm /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d/