<template>
    <ul>
        <li v-for="item in fullParsedArray" v-bind:key="item" v-html="item">
        </li>
    </ul>
</template>