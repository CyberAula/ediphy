FROM ubuntu:14.04
MAINTAINER Alfonso JM (ad.jimenez@alumnos.upm.es)

RUN apt-get update && \
    apt-get dist-upgrade -y &&\
    apt-get upgrade -y && \
    apt-get install -y git && \
    apt-get install -y curl && \
    apt-get install -y make && \
    apt-get install -y git-core && \
    apt-get install -y net-tools && \
    apt-get install -y software-properties-common && \
    apt-add-repository ppa:brightbox/ruby-ng && \
    apt-get update && \
    apt-get install -y ruby2.2 && \
    apt-get install -y sphinxsearch && \
    apt-get install -y apt-transport-https


# RUN ssh-keygen
RUN ssh-keygen -q -t rsa -N '' -f /id_rsa
RUN git clone -b docker_integration https://github.com/aljimenez97/vish.git
RUN apt-get install -y ruby2.2-dev libxml2-dev libxslt-dev libmagickcore-dev libmagickwand-dev libmysqlclient-dev libsqlite3-dev
RUN apt-get install -y imagemagick libpq-dev nodejs

WORKDIR vish
RUN gem install bundler -v '~> 1.17.0'
RUN bundle config set git.allow_insecure true
RUN bundle install

RUN cp config/application_config.yml.example config/application_config.yml
COPY application_config.yml config/database.yml

# Copy script

COPY docker-entrypoint.sh /opt/docker-entrypoint.sh
RUN chmod 755 /opt/docker-entrypoint.sh

ENTRYPOINT ["/opt/docker-entrypoint.sh"]
