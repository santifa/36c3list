#!/bin/env perl

use v5.10;
use utf8;
use warnings;
use strict;
use open ':encoding(UTF-8)';

use LWP::UserAgent;
use HTML::TreeBuilder::XPath;
use Data::Dumper;

my $base = "https://media.ccc.de";
my $site = "https://media.ccc.de/c/36c3";
my $ua = LWP::UserAgent->new(timeout => 20);
my $response = $ua->get($site);
die "Can't fetch site -- .", $response->status_line
    unless $response->is_success;

my $parser = HTML::TreeBuilder::XPath->new;
$parser->parse($response->decoded_content);
my @talks = $parser->findnodes('/html/body/div/div/div[@class="event-preview"]/div/h3/a');

my @objects;
for my $talk (@talks) {
    my $talk_ref = $talk->attr('href');
    my $talk_name = $talk->as_text;
    my $resp = $ua->get($base . $talk_ref);
    die "Can't fetch description for ", $talk_name, $response->status_line
        unless $response->is_success;

    my $parser = HTML::TreeBuilder::XPath->new;
    $parser->parse($resp->decoded_content);
    my @description = $parser->findvalues('//p');
    splice @description, 0, 2;
    @description = map {(my $x = $_) =~ s/\"/\\"/g; $x} @description;
    #splice @description, -2, 2;
    my $description = join ' ', @description;
    my $object = '{"name":"' . $talk_name . '", "description":"' . $description . '",' .
        '"url":"' . $base . $talk_ref . '"}';
    push (@objects, $object);
}

open(my $json, '>', "talks.json") or die "Can't open > talks.json: $!";
my $talks = join ', ', @objects;
print $json "[", $talks, "]";

close($json) || warn "close failed: $!";
